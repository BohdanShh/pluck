import Foundation
import ImageIO
import Vision

struct Recognition: Encodable {
    enum Kind: String, Encodable {
        case text
        case barcode
    }

    let kind: Kind
    let text: String
}

func fail(_ message: String, code: Int32 = 1) -> Never {
    fputs("\(message)\n", stderr)
    exit(code)
}

guard CommandLine.arguments.count == 2 else {
    fail("Usage: recognize-image <image-path>", code: 2)
}

let imageURL = URL(fileURLWithPath: CommandLine.arguments[1])

guard let source = CGImageSourceCreateWithURL(imageURL as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    fail("Could not load image at \(imageURL.path)")
}

let textRequest = VNRecognizeTextRequest()
textRequest.recognitionLevel = .accurate
textRequest.usesLanguageCorrection = false
textRequest.automaticallyDetectsLanguage = true

let barcodeRequest = VNDetectBarcodesRequest()

do {
    try VNImageRequestHandler(cgImage: image).perform([textRequest, barcodeRequest])
} catch {
    fail("Recognition failed: \(error.localizedDescription)")
}

// Vision's origin is bottom-left, so a larger maxY means higher on screen.
var payloads: [String] = []

for barcode in (barcodeRequest.results ?? []).sorted(by: { $0.boundingBox.maxY > $1.boundingBox.maxY }) {
    if let payload = barcode.payloadStringValue, !payload.isEmpty, !payloads.contains(payload) {
        payloads.append(payload)
    }
}

// A barcode in the selection wins over the text around it.
let recognition = payloads.isEmpty
    ? Recognition(
        kind: .text,
        text: (textRequest.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
    )
    : Recognition(kind: .barcode, text: payloads.joined(separator: "\n"))

guard let json = try? JSONEncoder().encode(recognition) else {
    fail("Could not encode the result")
}

FileHandle.standardOutput.write(json)

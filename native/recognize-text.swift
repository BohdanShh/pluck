import ImageIO
import Vision

func fail(_ message: String, code: Int32 = 1) -> Never {
    fputs("\(message)\n", stderr)
    exit(code)
}

guard CommandLine.arguments.count == 2 else {
    fail("Usage: recognize-text <image-path>", code: 2)
}

let imageURL = URL(fileURLWithPath: CommandLine.arguments[1])

guard let source = CGImageSourceCreateWithURL(imageURL as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    fail("Could not load image at \(imageURL.path)")
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false
request.automaticallyDetectsLanguage = true

do {
    try VNImageRequestHandler(cgImage: image).perform([request])
} catch {
    fail("Text recognition failed: \(error.localizedDescription)")
}

let lines = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }

print(lines.joined(separator: "\n"))

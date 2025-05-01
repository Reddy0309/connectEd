export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
 const pdfFile = req.files?.message;

    if (!sender || !receiver || !pdfFile) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    console.log("Received PDF:", pdfFile.name);
    console.log("Message received:", { sender, receiver, message });

    // TODO: Store the message in MongoDB if needed

    res.status(200).json({ success: true, message: "Report sent successfully" });
  } catch (error) {
    console.error("Error in sending report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const uploadReport = (req, res) => {
  try {
    if (!req.files || !req.files.report) {
      return res.status(400).json({ message: "No report file uploaded" });
    }

    const reportFile = req.files.report;
    const uploadPath = `./uploads/${reportFile.name}`;

    reportFile.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving file", error: err });
      }
      res.status(200).json({ message: "Report uploaded successfully", path: uploadPath });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


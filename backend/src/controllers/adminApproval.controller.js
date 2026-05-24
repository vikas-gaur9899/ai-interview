import Admin from "../model/Admin.js";

/* ================= GET PENDING ADMINS ================= */
export const getPendingAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ status: "pending" });

    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/* ================= APPROVE ADMIN ================= */
export const approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await Admin.findByIdAndUpdate(id, { status: "approved" });

    res.json({ message: "Admin approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};

/* ================= REJECT ADMIN ================= */
export const rejectAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await Admin.findByIdAndDelete(id);

    res.json({ message: "Admin rejected" });
  } catch (err) {
    res.status(500).json({ message: "Reject failed" });
  }
};
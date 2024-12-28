import express from "express";
import csrGenerationController from "../controllers/CSRGenerate.Controller";

const router = express.Router();

router.post('/generate-csr', (req, res) => {
    try {
        csrGenerationController(req, res);
    } catch (error: any) {
        console.error("Error handling CSR generation:", error.message);
        res.status(500).send({ message: "Internal server error" });
    }
});

export default router;

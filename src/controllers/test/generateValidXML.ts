import { Request, Response } from "express";
import generateInvoiceXML from "../../services/xml-ubl-generation/simplefiedTax";
import { sampleInvoiceData } from "../../test/data/sampleInvoiceData";

export default function generateValidXMLInvoice(req: Request, res: Response) {
    try {
        const generateXMLInvoice = generateInvoiceXML(sampleInvoiceData);
        res.set("Content-Type", "application/xml");
        res.send(generateXMLInvoice);

    } catch (error: any) {
        res.status(500).send({message: `There was error occured, error message: ${error.message}`});
    }
}
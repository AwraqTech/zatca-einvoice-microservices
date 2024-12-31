import { Request, Response } from "express";
import { Invoice } from "../../models/InvoiceXML";
import { validateInvoiceXML } from "../../models/ValidateInvoiceXML";
import { sampleInvoiceData } from "../../test/data/sampleInvoiceData";

export default function validateInvoiceInput(req: Request, res: Response) {
    try {
        const validateInput: Invoice = validateInvoiceXML(sampleInvoiceData);

        if (!validateInput) {
            res.status(401).send({message: 'Inputs are invalid'});
        }

        res.status(200).send({message: 'Inputs are valid'});
    } catch (error: any) {
        res.status(500).send({message: `There was error occured, error message: ${error.message}`});
    }
}
import { execSync, ExecSyncOptions } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

/**
 * Generate CSR using OpenSSL without writing to disk, in memory.
 * 
 * @param {string} commonName - The common name (e.g., domain name or YOUR name).
 * @param {string} serialNumber - The serial number for the CSR.
 * @param {string} organizationIdentifier - The organization's identifier (e.g., Tax ID or Business Registration).
 * @param {string} organizationUnitName - The organizational unit (department).
 * @param {string} organizationName - The organization name.
 * @param {string} countryName - The country name (2-letter code).
 * @param {string} invoiceType - Invoice Type
 * @param {string} locationAddress - Location Address
 * @param {string} industryBusinessCategory - Industry Business Category
 * @param {string} privateKeyPassword - Password for protecting the private key (optional)
 * 
 * @returns {Object} - Contains `csrPem`, `privateKeyPem`, `publicKeyPem`, and `publicKeyClean` (all in PEM format).
 */
export default function generateCSR(
    commonName: string,
    serialNumber: string,
    organizationIdentifier: string,
    organizationUnitName: string,
    organizationName: string,
    countryName: string,
    invoiceType: string,
    locationAddress: string,
    industryBusinessCategory: string,
    privateKeyPassword?: string // Optional password for the private key
) {
    try {
        // Prepare the OpenSSL configuration as a string
        const opensslConfig = `
[req]
prompt = no
utf8 = no
distinguished_name = my_req_dn_prompt
req_extensions = v3_req

[v3_req]
1.3.6.1.4.1.311.20.2 = ASN1:UTF8String:TSTZATCA-Code-Signing
subjectAltName = dirName:dir_sect

[dir_sect]
SN = ${serialNumber}
UID = ${organizationIdentifier}
title = ${invoiceType}
registeredAddress = ${locationAddress}
businessCategory = ${industryBusinessCategory}

[my_req_dn_prompt]
commonName = ${commonName}
organizationalUnitName = ${organizationUnitName}
organizationName = ${organizationName}
countryName = ${countryName}
`;

        // Create a temporary file for OpenSSL configuration
        const tempConfigFile = path.join(tmpdir(), `openssl_config_${Date.now()}.conf`);
        writeFileSync(tempConfigFile, opensslConfig);

        // Generate EC parameters for secp256k1
        const ecParamFile = path.join(tmpdir(), `secp256k1_ecparams_${Date.now()}.pem`);
        execSync('openssl ecparam -name secp256k1 -out ' + ecParamFile);

        // Create temporary files to store the key and CSR
        const keyFilePath = path.join(tmpdir(), `private_key_${Date.now()}.pem`);
        const csrFilePath = path.join(tmpdir(), `csr_${Date.now()}.pem`);
        const publicKeyPath = path.join(tmpdir(), `public_key_${Date.now()}.pem`);

        // Construct the OpenSSL command to generate the private key and CSR
        let opensslCmd = `openssl req -new -newkey ec:${ecParamFile} -keyout ${keyFilePath} -out ${csrFilePath} -config "${tempConfigFile}" -subj "/CN=${commonName}/O=${organizationName}/OU=${organizationUnitName}/C=${countryName}"`;

        // If a password is provided, add it to the command
        if (privateKeyPassword) {
            opensslCmd += ` -passout pass:${privateKeyPassword}`;
        } else {
            opensslCmd += ' -nodes'; // No password (private key unencrypted)
        }

        // Run the OpenSSL command to generate the CSR and private key
        execSync(opensslCmd, { encoding: 'utf8' });

        // Extract the public key from the private key
        const extractPublicKeyCmd = `openssl ec -in ${keyFilePath} -pubout -out ${publicKeyPath}`;
        execSync(extractPublicKeyCmd, { encoding: 'utf8' });

        // Read the generated files
        const privateKeyPem = readFileSync(keyFilePath, 'utf8');
        const csrPem = readFileSync(csrFilePath, 'utf8');
        const publicKeyPem = readFileSync(publicKeyPath, 'utf8');

        const publicKeyClean = publicKeyPem
            .replace(/-----BEGIN PUBLIC KEY-----/g, '')
            .replace(/-----END PUBLIC KEY-----/g, '')
            .replace(/\r?\n|\r/g, '')
            .trim();

        // Clean up temporary files
        unlinkSync(tempConfigFile);
        unlinkSync(ecParamFile);
        unlinkSync(keyFilePath);
        unlinkSync(csrFilePath);
        unlinkSync(publicKeyPath);

        // Ensure private key is properly formatted to match "BEGIN EC PRIVATE KEY"
        let formattedPrivateKey = privateKeyPem.trim();
        if (!formattedPrivateKey.startsWith('-----BEGIN EC PRIVATE KEY-----')) {
            formattedPrivateKey = `-----BEGIN EC PRIVATE KEY-----\n${formattedPrivateKey}\n-----END EC PRIVATE KEY-----`;
        }

        // Return CSR, private key, and public key
        return { csrPem, privateKeyPem: formattedPrivateKey, publicKeyPem, publicKeyClean };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
            throw new Error(`Error generating CSR: ${error.message}`);
        } else {
            console.error('An unknown error occurred while generating CSR.');
            throw new Error('An unknown error occurred while generating CSR.');
        }
    }
}

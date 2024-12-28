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
 * 
 * @returns {Object} - Contains `csrPem` and `privateKeyPem` (both in PEM format).
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
    industryBusinessCategory: string
) {
    try {

        // Prepare the OpenSSL configuration as a string, now in the new format
        const opensslConfig = `
# ------------------------------------------------------------------
# Default section for "req" command options
# ------------------------------------------------------------------
[req]

# Password for reading in existing private key file
# input_password = SET_PRIVATE_KEY_PASS

# Prompt for DN field values and CSR attributes in ASCII
prompt = no
utf8 = no

# Section pointer for DN field options
distinguished_name = my_req_dn_prompt

# Extensions
req_extensions = v3_req

[ v3_req ]
#basicConstraints=CA:FALSE
#keyUsage = digitalSignature, keyEncipherment
# Production or Testing Template (TSTZATCA-Code-Signing - ZATCA-Code-Signing)
1.3.6.1.4.1.311.20.2 = ASN1:UTF8String:SET_PRODUCTION_VALUE
subjectAltName = dirName:dir_sect

[ dir_sect ]
# EGS Serial number (1-SolutionName|2-ModelOrVersion|3-serialNumber)
SN = ${serialNumber}
# VAT Registration number of TaxPayer (Organization identifier [15 digits begins with 3 and ends with 3])
UID = ${organizationIdentifier}
# Invoice type (TSCZ)(1 = supported, 0 not supported) (Tax, Simplified, future use, future use)
title = ${invoiceType}
# Location (branch address or website)
registeredAddress = ${locationAddress}
# Industry (industry sector name)
businessCategory = ${industryBusinessCategory}

# ------------------------------------------------------------------
# Section for prompting DN field values to create "subject"
# ------------------------------------------------------------------
[my_req_dn_prompt]
# Common name (EGS TaxPayer PROVIDED ID [FREE TEXT])
commonName = ${commonName}

# Organization Unit (Branch name)
organizationalUnitName = ${organizationUnitName}

# Organization name (Tax payer name)
organizationName = ${organizationName}

# ISO2 country code is required with US as default
countryName = ${countryName}
`;

        // Create a temporary file for the OpenSSL configuration
        const tempConfigFile = path.join(tmpdir(), `openssl_config_${Date.now()}.conf`);
        writeFileSync(tempConfigFile, opensslConfig);

        // Generate EC parameters for secp256k1
        const ecParamFile = path.join(tmpdir(), `secp256k1_ecparams_${Date.now()}.pem`);
        execSync('openssl ecparam -name secp256k1 -out ' + ecParamFile);  // Generate EC params for secp256k1

        // Create temporary files to store the key and CSR
        const keyFilePath = path.join(tmpdir(), `private_key_${Date.now()}.pem`);
        const csrFilePath = path.join(tmpdir(), `csr_${Date.now()}.pem`);

        // Construct the OpenSSL command with -subj to avoid interactive prompts
        const opensslCmd = `openssl req -new -newkey ec:${ecParamFile} -keyout ${keyFilePath} -out ${csrFilePath} -config "${tempConfigFile}" -subj "/CN=${commonName}/O=${organizationName}/OU=${organizationUnitName}/C=${countryName}" -nodes`;

        // Ensure proper encoding and shell configuration for Windows
        const options: ExecSyncOptions = { encoding: 'utf8', shell: 'cmd.exe', stdio: ['pipe', 'pipe', 'pipe'] };

        // Execute the command to generate CSR and private key
        const result: string | Buffer = execSync(opensslCmd, options);

        // If result is Buffer, convert to string
        const resultString = result.toString('utf8');

        // Log the OpenSSL output
        console.log('OpenSSL Command Result:', resultString);

        // Read the generated CSR and private key from temporary files
        const privateKeyPem = readFileSync(keyFilePath, 'utf8');
        const csrPem = readFileSync(csrFilePath, 'utf8');

        // Clean up temporary files
        unlinkSync(tempConfigFile);
        unlinkSync(ecParamFile);
        unlinkSync(keyFilePath);
        unlinkSync(csrFilePath);

        // Return both CSR and private key in PEM format
        return { csrPem, privateKeyPem };
    } catch (error: unknown) {
        // Handle unknown error type safely
        if (error instanceof Error) {
            console.error('Error:', error.message);
            throw new Error(`Error generating CSR, Error message: ${error.message}`);
        } else {
            console.error('An unknown error occurred while generating CSR.');
            throw new Error('An unknown error occurred while generating CSR.');
        }
    }
}

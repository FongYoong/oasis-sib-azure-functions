import { AzureFunction, Context, HttpRequest } from "@azure/functions"
//const HTMLtoPDF = require("pdf-puppeteer");
//import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';
const concatStream = require('concat-stream')
const fs = require('fs')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile);

require('wkhtmltopdf').command = "wkhtmltox64\\bin\\wkhtmltopdf.exe"
const wkhtmltopdf = require('wkhtmltopdf');
// C:\\home\\site\\wwwroot\\wkhtmltox\\bin\\wkhtmltopdf.exe

//const margin = 40;
//const outputName = "D:\\local\\Temp\\html_pdf_out.pdf";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('htmlToPDFHTTPTrigger processed a request.');

    const body = req.body;
    if (body.htmlString) {
        //wkhtmltopdf(body.htmlString).pipe(fs.createWriteStream(outputName));
        const pdfStream = wkhtmltopdf(body.htmlString);
        const data: Buffer = await new Promise(function(resolve, reject) {
            const bufStream = concatStream((buffer) => {
                resolve(buffer)
            });
            pdfStream.pipe(bufStream);
        });

        //const data = await streamToBuffer(stream);
        context.log(body.htmlString)
        context.log('data: ')
        //context.log(data)
        context.log(data.toString().length);
        //fs.writeFileSync('C:\\Users\\ACER NITRO5\\Desktop\\oasis-sib-azure-functions/out2.pdf', data);

        context.res = {
            status: 200,
            headers: { 'content-type': 'application/pdf' },
            body: data.toString(),
            isRaw: true
        }
        //context.done();
        // try {
        //     const data = await readFileAsync(outputName);
        //     context.res = {
        //         status: 200,
        //         headers: { 'content-type': 'application/pdf' },
        //         body: data,
        //     }
        //     context.log('data: ')
        //     context.log(data)
        //     context.log(data.length)
        //     context.done();
        // } catch (err) {
        //     context.log.error('ERROR', err);
        //     throw err;
        // }

    }
    else {
        context.res = {
            status: 400,
            body: "htmlString parameter missing"
        }
        context.done();
    }
};

export default httpTrigger;

        // const blob: Blob = await new Promise(function(resolve, reject) {
        //     stream.on('finish', function () {
        //         context.log("Done")
        //         const b = stream.toBlob('application/pdf');
        //         resolve(b);
        //     });
        // });
        // context.log(blob)

        // const fileBuffer: Buffer = await new Promise(function(resolve, reject) {
        //     HTMLtoPDF(body.htmlString, (pdf) => {
        //         resolve(pdf)
        //     },
        //     {
        //         margin: {
        //             top: margin,
        //             right: margin,
        //             bottom: margin,
        //             left: margin
        //         }
        //     },
        //     {
        //         ignoreDefaultArgs: ['--disable-extensions'],
        //         executablePath: "C:\\home\\site\\wwwroot\\node_modules\\puppeteer\\.local-chromium\\win64-686378\\chrome-win\\chrome.exe"
        //     }
        //     // {
        //     //     args: chromium.args,
        //     //     defaultViewport: chromium.defaultViewport,
        //     //     executablePath: chromeExecutablePath,
        //     //     headless: chromium.headless,
        //     //     ignoreHTTPSErrors: true,
        //     // }
        //     );
        // });
        // context.res = {
        //     status: 200,
        //     headers: { 'content-type': 'application/pdf' },
        //     body: fileBuffer,
        //     isRaw: true
        // }
const ftp = require('basic-ftp');
const path = require('path');

const FILES_TO_DEPLOY = [
    // New JS files
    'js/page-animations.js',
    'js/audit-wizard.js',
    'js/guide-ebook.js',
    // Modified HTML pages
    'ia-accueil-telephonique.html',
    'ia-pour-avocat.html',
    'ia-pour-comptable.html',
    'ia-pour-rh.html',
    'template-industrie.html',
    'audit-ia.html',
    'guide-ia-pme-2026.html',
    // Security config
    '.htaccess'
];

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    
    try {
        await client.access({
            host: "dd129.ftp.infomaniak.com",
            user: "d129_dimitri",
            password: "gd9hCXGNcnaELPX*",
            secure: true
        });
        console.log("✅ Connected to FTP");

        // Ensure js/ directory exists on remote
        await client.ensureDir("js");
        await client.cd("/");

        for (const file of FILES_TO_DEPLOY) {
            const localPath = path.join(__dirname, file);
            const remotePath = file;
            
            try {
                // Ensure remote directory exists
                const dir = path.dirname(remotePath);
                if (dir !== '.') {
                    await client.ensureDir(dir);
                    await client.cd("/");
                }
                
                await client.uploadFrom(localPath, remotePath);
                console.log(`✅ Uploaded: ${file}`);
            } catch (err) {
                console.error(`❌ Failed to upload ${file}:`, err.message);
            }
        }
        
        console.log("\n🎉 Deployment complete!");
    } catch (err) {
        console.error("❌ FTP Connection Error:", err);
    }
    
    client.close();
}

deploy();

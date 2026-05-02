const ftp = require('basic-ftp');

async function test() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "dd129.ftp.infomaniak.com",
            user: "d129_dimitri",
            password: "gd9hCXGNcnaELPX*",
            secure: true
        });
        console.log("Connected to FTP");
        const list = await client.list();
        console.log("Directory listing at root:");
        list.forEach(item => console.log(item.name));
    }
    catch(err) {
        console.error("FTP Error:", err);
    }
    client.close();
}

test();

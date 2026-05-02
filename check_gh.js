const https = require('https');

https.get('https://api.github.com/repos/kickbug1975/digital/actions/runs?per_page=3', {
  headers: {
    'User-Agent': 'Node.js'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.workflow_runs) {
        console.log("Derniers déploiements (GitHub Actions) :");
        json.workflow_runs.forEach(run => {
          console.log(`- Commit: "${run.head_commit.message.split('\n')[0]}"`);
          console.log(`  Statut: ${run.status} | Résultat: ${run.conclusion || 'en cours'}`);
          console.log(`  URL: ${run.html_url}`);
          console.log('---------------------------');
        });
      } else {
        console.log(data);
      }
    } catch(e) {
      console.error(e);
    }
  });
}).on('error', (e) => {
  console.error(e);
});

const axios = require('axios');
const publicIp = require('public-ip');
var Stopwatch = require("node-stopwatch").Stopwatch;
 
const config = {
  headers: { Authorization: `Bearer ${process.env.NETLIFY_AUTH}` }
};

setInterval(async function() {
  try{
    var stopwatch = Stopwatch.create();
    stopwatch.start();
    console.log(`Starting time: ${new Date().toUTCString()}`)
    console.log(`Updating dns records for zone: ${process.env.NETLIFY_ZONE}. hostnames: ${process.env.HOSTNAMES}`)

    var records = await getRecords();

    var hostnames = process.env.HOSTNAMES.split(',');
  
    // foreach record match subdomins from env and delete
    records.forEach(async record => {
      if (hostnames.includes(record.hostname)){
        await deleteRecord(record.id, record.hostname);
      }
    });
  
    // foreach subdomain create new record
    hostnames.forEach(async hostname => {
      await createRecord(hostname);
    });

    console.log("finished in: " + stopwatch.elapsedMilliseconds + " milliseconds");
    console.log(`Finish time: ${new Date().toUTCString()}`)
  }
  catch(error) {
    console.log(error);
  }
}, 5 * 60 * 1000); // 5 mins

async function deleteRecord(id, hostname){
  console.log(`deleting dns record. id: ${id}, hostname: ${hostname}`)
  return await axios.delete(`https://api.netlify.com/api/v1/dns_zones/${process.env.NETLIFY_ZONE}/dns_records/${id}`, config)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.log(error);
    return null;
  });
}

async function getRecords(){
  console.log(`Getting existing dns records.`)
  return await axios.get(`https://api.netlify.com/api/v1/dns_zones/${process.env.NETLIFY_ZONE}/dns_records`, config)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.log(error);
    return null;
  });
}

async function createRecord(hostname){

  var ip = await getIp();
  console.log(`Public ip: ${ip}`);

  var body = {"type":"A","hostname":hostname ,"value": ip};

  console.log(`Creating dns record for hostname: ${hostname}. body ${JSON.stringify(body)}`)

  return await axios.post(`https://api.netlify.com/api/v1/dns_zones/${process.env.NETLIFY_ZONE}/dns_records`, body, config)
  .then(response => {
      return response.data;
  })
  .catch(error => {
      console.log(error);
      return null;
  });
}

async function getIp(){
  console.log(`Getting public ip`);
  return await publicIp.v4();
}

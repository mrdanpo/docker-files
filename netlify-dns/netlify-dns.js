const axios = require('axios');
const publicIp = require('public-ip');

const config = {
  headers: { Authorization: `Bearer ${process.env.NETLIFY_AUTH}` }
};

setInterval(async function() {
  var records = await getRecords();

  var hostnames = process.env.HOSTNAMES.split(',');

  // foreach record match subdomins from env and delete
  records.forEach(async record => {
    if (hostnames.includes(record.hostname)){
      await deleteRecord(record.id);
    }
  });

  // foreach subdomain create new record
  hostnames.forEach(async hostname => {
    await createRecord(hostname);
  });
}, 5 * 60 * 1000); // 5 mins

async function deleteRecord(id){
  return await axios.delete(`https://api.netlify.com/api/v1/dns_zones/${process.env.NETLIFY_ZONE}/dns_records/${id}`, config)
  .then(response => {
    console.log(response.data);
    return response.data;
  })
  .catch(error => {
    console.log(error);
    return null;
  });
}

async function getRecords(){
  return await axios.get(`https://api.netlify.com/api/v1/dns_zones/${process.env.NETLIFY_ZONE}/dns_records`, config)
  .then(response => {
    console.log(response.data);
    return response.data;
  })
  .catch(error => {
    console.log(error);
    return null;
  });
}

async function createRecord(hostname){
  var ip = await getIp();

  var body = {"type":"A","hostname":hostname ,"value": ip};

  return await axios.post(`https://api.netlify.com/api/v1/dns_zones/${process.env.NETLIFY_ZONE}/dns_records`, body, config)
  .then(response => {
      console.log(response.data);
      return response.data;
  })
  .catch(error => {
      console.log(error);
      return null;
  });
}

async function getIp(){
  return await publicIp.v4();
}

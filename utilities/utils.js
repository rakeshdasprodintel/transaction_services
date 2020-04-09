const request = require('request-promise');
const nodemailer = require('nodemailer');
const FCM = require('fcm-node');
const to = require('await-to-js').default;

const sendSMS = function(data){
  let options = {
    method: 'POST',
    uri: 'https://control.msg91.com/api/sendhttp.php?mobiles=+91' + data.mobile + '&message=' + data.message + '&sender=TradeI&route=4&country=91',
    headers:{
      'authkey': CONSTANTS.DEV.SMS_AUTH_KEY
    },
    json: true
  };
  request(options, function (err, res, body) {
      if (err || res.statusCode !== 200) {
        console.log(err);
      }else{
        console.log(body);
      }
  });
}

const sendEmail = function(data){
  let transporter = nodemailer.createTransport({
    "host": CONSTANTS.DEV.EMAIL_HOST,
    "port": CONSTANTS.DEV.EMAIL_PORT,
    "secure": false,
    "auth": {
        "user": CONSTANTS.DEV.EMAIL_USER,
        "pass": CONSTANTS.DEV.EMAIL_PASS
    }
  });
  let mailOptions = {
    "from": CONSTANTS.DEV.EMAIL_USER,
    "to": data.receiverEmail,
    "subject": data.subject,
    "text": data.body
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error)
      console.log('Email Error: ', error);
    else
      console.log('Email sent: ' + info.response);
  });
}

const sendNotification = function(ele){
  let serverKey = CONSTANTS.DEV.NOTIFICATION_SERVER_KEY;
  let fcm = new FCM(serverKey);

  let message = {
    to: ele.deviceId,
    data: {
      pn_title: ele.title,
      pn_body: ele.body
    },
    notification: {
      title: ele.title,
      body: ele.body
    }
  };

  if('image' in ele)
    message['data']['pn_big_image'] = ele.image;
  if('type' in ele)
    message['data']['pn_dest_type'] = ele.type;
  if('typeId' in ele)
    message['data']['pn_dest_id'] = ele.typeId;
  if('slug' in ele)
    message['data']['pn_dest_slug'] = ele.slug;

  fcm.send(message, function(err, res) { // Add subscribe to a topic.
    if(err){
      console.log('Something has gone wrong!', err);
    }else{
      console.log('Successfully sent with response: ', res);
    }
  });
}

const subscribeToTopic = async function(token, topic){
  let serverKey = CONSTANTS.DEV.NOTIFICATION_SERVER_KEY;
  let fcm = new FCM(serverKey);

  fcm.subscribeToTopic([ token ], topic, (err, res) => {
    if(err){
      return err;
    }else{
      return res;
    }
  });
}

const unsubscribeToTopic = async function(token, topic){
  let serverKey = CONSTANTS.DEV.NOTIFICATION_SERVER_KEY;
  let fcm = new FCM(serverKey);

  fcm.unsubscribeToTopic([ token ], topic, (err, res) => {
    if(err){
      return err;
    }else{
      return res;
    }
  });
}

const formatDate = function(date){
  let day =  new Date(date).getDay();
  let month = new Date(date).getMonth() + 1;
  let year = new Date(date).getUTCFullYear();
  return day + '-' + month + '-' + year;
};

const formatCurrentDateForSQL = function() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const calculateVolumetricWeight = function(length, breadth, height, factor){
  return (length * breadth * height) / factor;
};

const maxLogisticsWeight = function(volW, norW){
  return Math.max(volW, norW);
};

const maxLogisticsCost = function(val1, val2){
  return Math.max(val1, val2);
};

module.exports = {
  sendSMS,
  sendEmail,
  formatDate,
  calculateVolumetricWeight,
  maxLogisticsWeight,
  maxLogisticsCost,
  sendNotification,
  subscribeToTopic,
  formatCurrentDateForSQL
};

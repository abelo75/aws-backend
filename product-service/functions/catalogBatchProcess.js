import {createProductInDb} from "./createProduct";
import {snsClient, TOPIC} from "./clients";
import {PublishCommand} from '@aws-sdk/client-sns';

export const groupBy = (src = [], field) => src.reduce((prev, current) => {
  if (!prev[current[field]]) {
    prev[current[field]] = [];
  }
  prev[current[field]].push(current);
  return prev;
}, {});

export const splitByPlace = (messages) => groupBy(messages, 'placeId');

export const catalogBatchProcess = async (event) => {
  const result = {
    statusCode: 400, error: null, body: '',
  };
  console.log('Event', JSON.stringify(event));
  const messages = [];
  try {
    for (const record of event?.Records) {
      let body;
      try {
        body = JSON.parse(record?.body);
      } catch (e) {
        result.error = e?.message ?? JSON.stringify(e);
        console.warn('Body parse error', JSON.stringify(e));
      }
      if (!body) {
        continue;
      }
      if (typeof body !== "object") {
        continue;
      }
      if (Array.isArray(body)) {
        for (const rec of body) {
          await createProductInDb(rec);
          messages.push(rec);
        }
        continue;
      }
      await createProductInDb(body);
      messages.push(body);
    }
    const split = splitByPlace(messages);
    console.log('Messages', JSON.stringify({messages, split}));
    for (const [key, value] of Object.entries(split)) {
      try {
        const snsParams = {
          Message: `New data coming for placeId ${key} ${JSON.stringify(value)}`, TopicArn: TOPIC, MessageAttributes: {
            'placeId': {DataType: 'String', StringValue: key},
          }, Subject: `message for placeId #${key}`
        };
        const command = new PublishCommand(snsParams);
        await snsClient.send(command);
      } catch (e) {
        console.warn('Something went wrong', JSON.stringify({msg: e?.message, e}));
      }
    }
    result.statusCode = 200;
  } catch (e) {
    console.warn('Error in batch process', JSON.stringify(e));
    result.statusCode = 500;
    result.error = e?.message ?? JSON.stringify(e);
  }
  return result;
}

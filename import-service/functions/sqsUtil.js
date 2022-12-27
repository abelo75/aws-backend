import { SendMessageCommand, SQSClient, GetQueueUrlCommand } from "@aws-sdk/client-sqs"
import {REGION, ACCOUNT_ID, QUEUE_NAME} from "./config";

export const sqsClient = new SQSClient({ region: REGION });

export const getUrl = async () => {
  try {
    const params = {
      QueueName: QUEUE_NAME,
      QueueOwnerAWSAccountId: ACCOUNT_ID
    };

    const command = new GetQueueUrlCommand(params);
    console.log('getUrl params', JSON.stringify({ params, command }));
    const url = await sqsClient.send(command);
    console.log('getUrl params url', JSON.stringify(url));

    return url;
  } catch (e) {
    console.warn('Error get URL', JSON.stringify(e));
  }
  return {};
}
export const sendMessageToProductQueue = async (result) => {
  const url = await getUrl();
  try {
    const command = new SendMessageCommand({
      MessageBody: JSON.stringify(result),
      QueueUrl: url?.QueueUrl,
    });
    console.log('Command to send', JSON.stringify({ command, url }));
    const res = await sqsClient.send(command);
    console.log('Result', JSON.stringify(res));
    return res;
  } catch (e) {
    console.warn('Error send message', e?.message ?? JSON.stringify(e));
  }
}

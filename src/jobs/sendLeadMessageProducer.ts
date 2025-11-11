import boss from '../workers/boss';
import {
  SEND_LEAD_MESSAGE_JOB,
  SendLeadMessagePayload,
} from './sendLeadMessageJob';

export const enqueueSendLeadMessage = async (payload: SendLeadMessagePayload) => {
  return boss.send(SEND_LEAD_MESSAGE_JOB, payload);
};

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import * as https from "https";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await axios.post(
    `${ENDPOINT}/api/v1/transactions/details/labels`,
    {
      txHash: req.body.txHash,
      txLabels: req.body.labels,
    },
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        // @ts-ignore
        Authorization: req.headers.authorization,
      },
    }
  );
  res.send(response.data.data);
}

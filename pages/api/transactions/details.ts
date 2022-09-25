// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await axios.post(
    `${ENDPOINT}/transactions/details`,
    {
      tx_hash: req.body.txHash,
      memo: req.body.memo,
      labels: req.body.labels,
    },
    {
      headers: {
        Authorization: req.headers.authorization,
      },
    }
  );
  res.send(response.data.data);
}

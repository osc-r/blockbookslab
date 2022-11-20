// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import * as https from "https";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await axios.get(
    // @ts-ignore
    `${ENDPOINT}/transactions/results/${req.query.address.toLowerCase()}`,
    {
      headers: {
        // @ts-ignore
        Authorization: req.headers.authorization,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      })
    }
  );
  res.send(response.data.data);
}

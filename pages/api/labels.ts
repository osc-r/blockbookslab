// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import * as https from "https";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const response = await axios.post(
      `${ENDPOINT}/api/v1/labels`,
      {
        name: req.body.name,
      },
      {
        headers: {
          // @ts-ignore
          Authorization: req.headers.authorization,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );

    res.send(response.data.data);
  } else {
    const response = await axios.get(
      // "http://localhost:4000/api/v1/auth/nonce",
      `${ENDPOINT}/api/v1/labels`,
      {
        headers: {
          // @ts-ignore
          Authorization: req.headers.authorization,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );
    res.send(response.data.data);
  }
}

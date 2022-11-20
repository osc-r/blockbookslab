// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import * as https from "https";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const verifyRes = await axios.post(
    `${ENDPOINT}/api/v1/auth/verify`,
    // "http://localhost:4000/api/v1/auth/verify",
    // "http://localhost:8000/login",

    { message: req.body.message, signature: req.body.signature },
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }
  );

  console.log({ verifyRes: verifyRes.data.data });

  res.json(verifyRes.data.data);
}

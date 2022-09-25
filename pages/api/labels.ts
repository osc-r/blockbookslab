// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await axios.get(
    // "http://localhost:4000/api/v1/auth/nonce",
    `${ENDPOINT}/labels`,
    {
      headers: {
        Authorization: req.headers.authorization,
      },
    }
  );
  res.send(response.data.data);
}

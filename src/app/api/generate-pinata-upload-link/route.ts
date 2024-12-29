import { NextRequest, NextResponse } from "next/server";

const keyRestrictions = {
  keyName: "Signed Upload JWT",
  maxUses: 1,
  permissions: {
    endpoints: {
      data: {
        pinList: false,
        userPinnedDataTotal: false,
      },
      pinning: {
        pinFileToIPFS: true,
        pinJSONToIPFS: false,
        pinJobs: false,
        unpin: false,
        userPinPolicy: false,
      },
    },
  },
};

export async function POST(_req: NextRequest) {
  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify(keyRestrictions),
    };

    const jwtRepsonse = await fetch(
      "https://api.pinata.cloud/users/generateApiKey",
      options
    );

    const json = await jwtRepsonse.json();
    const { JWT } = json;
    return NextResponse.json(
      {
        jwt: JWT,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: " Server Error | Please try again later",
        error: error,
      },
      { status: 500 }
    );
  }
}

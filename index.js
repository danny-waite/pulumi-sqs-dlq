"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");

async function go() {
  const identity = await aws.getCallerIdentity();

  const dlqName = "dannytest-dlq";

  const dlq = new aws.sqs.Queue(dlqName, { name: dlqName });

  const deadLetterTargetArn = `arn:aws:sqs:${aws.config.region}:${identity.accountId}:${dlqName}`;

  const q = new aws.sqs.Queue(
    "dannytest",
    {
      redrivePolicy: JSON.stringify({
        deadLetterTargetArn,
        maxReceiveCount: "5"
      })
    },
    { dependsOn: dlq }
  );
}

go();

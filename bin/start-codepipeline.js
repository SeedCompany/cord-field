const AWS = require('aws-sdk');

try {
  const awsRegion = process.env.AWS_REGION;
  const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
  const awssecretKey = process.env.AWS_SECRET_ACCESS_KEY;
  const pipelineName = process.env.PIPELINE_NAME;
  const roleArn = process.env.ROLE_ARN;
  const gitBranch = process.env.GIT_BRANCH;

  console.log('awsRegion', awsRegion);
  console.log('branchName', gitBranch);

  AWS.config = new AWS.Config({
    region: awsRegion,
    secretAccessKey: awssecretKey,
    accessKeyId: awsAccessKey,
  });

  AWS.config.update({
    region: awsRegion,
    credentials: new AWS.Credentials({
      accessKeyId: awsAccessKey,
      secretAccessKey: awssecretKey,
    }),
  });

  // AWS.config.region = awsRegion;
  // AWS.config.accessKeyId = awsAccessKey;
  // AWS.config.secretAccessKey = awssecretKey;

  const codepipeline = new AWS.CodePipeline({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awssecretKey,
    },
  });

  codepipeline.getPipeline(
    {
      name: pipelineName,
    },
    function (err, okData) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log('Pipeline exists');
        console.log(okData);

        const sourceAction = okData.pipeline.stages[0].actions[0];
        sourceAction.configuration.Branch = gitBranch;

        codepipeline.updatePipeline(
          {
            pipeline: {
              name: pipelineName,
              // don't worry about this, it'll be removed
              roleArn: roleArn,
              ...okData.pipeline,
              stages: [...okData.pipeline.stages],
            },
          },
          function (err, okData) {
            if (err) {
              console.log(err, err.stack);
            } else {
              console.log("Pipeline's been updated with the new source");
              console.log(okData);

              console.log('Starting pipeline execution...');
              codepipeline.startPipelineExecution(
                {
                  name: pipelineName,
                },
                function (err, okData) {
                  if (err) {
                    console.log(err, err.stack);
                  } else {
                    console.log(okData);
                  }
                }
              );
            }
          }
        );
      }
    }
  );

  // codepipeline.updatePipeline(
  //   {
  //     pipeline: {
  //       name: pipelineName,
  //       // don't worry about this, it'll be removed
  //       roleArn: roleArn,
  //       stages: [
  //         {
  //           name: 'Source',
  //           actions: [
  //             {
  //               name: 'Source',
  //               actionTypeId: {
  //                 category: 'Source',
  //                 owner: 'ThirdParty',
  //                 provider: 'GitHub',
  //                 version: '1',
  //               },
  //               configuration: {
  //                 Owner: 'SeedCompany',
  //                 Repo: 'cord-field',
  //                 Branch: branchName,
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  //   function (err, okData) {
  //     if (err) {
  //       console.log(err, err.stack);
  //     } else {
  //       console.log("Pipeline's been updated with the new source");
  //       console.log(okData);

  //       console.log('Starting pipeline execution...');
  //       codepipeline.startPipelineExecution(
  //         {
  //           name: pipelineName,
  //         },
  //         function (err, okData) {
  //           if (err) {
  //             console.log(err, err.stack);
  //           } else {
  //             console.log(okData);
  //           }
  //         }
  //       );
  //     }
  //   }
  // );
} catch (error) {
  process.exitCode = 1;
}

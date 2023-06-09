const AWS = require('aws-sdk');

function triggerPipeline({ codepipeline, pipelineName }) {
  codepipeline.startPipelineExecution(
    {
      name: pipelineName,
    },
    function (err, okData) {
      if (err) {
        throw err;
      } else {
        console.log('Pipeline execution started:', okData);
      }
    }
  );
}

function updatePipeline({
  codepipeline,
  pipelineName,
  roleArn,
  gitBranch,
  existingPipeline,
}) {
  const sourceAction = existingPipeline.stages[0].actions[0];
  sourceAction.configuration.Branch = gitBranch;

  codepipeline.updatePipeline(
    {
      pipeline: {
        name: pipelineName,
        roleArn,
        ...existingPipeline,
        stages: [...existingPipeline.stages],
      },
    },
    function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Pipeline's been updated with the new source");

        console.log('Starting pipeline execution...');
        triggerPipeline({ codepipeline, pipelineName });
      }
    }
  );
}

function run() {
  try {
    const awsRegion = process.env.AWS_REGION;
    const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
    const awssecretKey = process.env.AWS_SECRET_ACCESS_KEY;
    const pipelineName = process.env.PIPELINE_NAME;
    const roleArn = process.env.ROLE_ARN;
    const gitBranch = process.env.GIT_BRANCH;

    AWS.config = new AWS.Config();

    AWS.config.update({
      region: awsRegion,
      credentials: new AWS.Credentials({
        accessKeyId: awsAccessKey,
        secretAccessKey: awssecretKey,
      }),
    });

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
        // Eslint is wrong here, err can be undefined
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (err) {
          throw err;
        } else {
          updatePipeline({
            codepipeline,
            pipelineName,
            roleArn,
            gitBranch,
            existingPipeline: okData.pipeline,
          });
        }
      }
    );
  } catch (error) {
    process.exitCode = 1;
  }
}

run();

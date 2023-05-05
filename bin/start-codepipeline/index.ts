import * as AWS from 'aws-sdk';

function triggerPipeline({
  codepipeline,
  pipelineName,
}: {
  codepipeline: AWS.CodePipeline;
  pipelineName: string;
}) {
  codepipeline.startPipelineExecution(
    {
      name: pipelineName,
    },
    function (
      err: AWS.AWSError | undefined,
      okData: AWS.CodePipeline.StartPipelineExecutionOutput
    ) {
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
  gitBranch,
  existingPipeline,
}: {
  codepipeline: AWS.CodePipeline;
  pipelineName: string;
  roleArn: string;
  gitBranch: string;
  existingPipeline: AWS.CodePipeline.PipelineDeclaration;
}) {
  const sourceAction = existingPipeline.stages[0]!.actions[0];
  sourceAction!.configuration!.Branch = gitBranch;

  codepipeline.updatePipeline(
    {
      pipeline: {
        ...existingPipeline,
        stages: [...existingPipeline.stages],
      },
    },
    function (err: AWS.AWSError | undefined) {
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
  console.log('Starting pipeline update...');
  try {
    const awsRegion = process.env.AWS_REGION!;
    const awsAccessKey = process.env.AWS_ACCESS_KEY_ID!;
    const awssecretKey = process.env.AWS_SECRET_ACCESS_KEY!;
    const pipelineName = process.env.PIPELINE_NAME!;
    const roleArn = process.env.ROLE_ARN!;
    const gitBranch = process.env.GIT_BRANCH!;

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
      function (
        err: AWS.AWSError | undefined,
        okData: AWS.CodePipeline.GetPipelineOutput
      ) {
        if (err) {
          throw err;
        } else {
          updatePipeline({
            codepipeline,
            pipelineName,
            roleArn,
            gitBranch,
            existingPipeline: okData.pipeline!,
          });
        }
      }
    );
  } catch (error) {
    process.exitCode = 1;
  }
}

run();

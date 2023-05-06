import { PipelineExecutionStatus } from '@aws-sdk/client-codepipeline';
import * as AWS from 'aws-sdk';

export class TriggerPipeline {
  private readonly codepipeline: AWS.CodePipeline;
  private readonly pipelineName: string;
  private readonly gitBranch?: string;
  private timesChecked = 0;

  // returns the number of seconds to wait before checking the pipeline status again
  private get delay() {
    if (this.timesChecked < 4) {
      return 60;
    }
    if (this.timesChecked < 10) {
      return 30;
    }
    return this.timesChecked < 30 ? 20 : 10;
  }

  private sleep(s: number) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }

  async triggerPipeline() {
    return await new Promise<AWS.CodePipeline.StartPipelineExecutionOutput>(
      (resolve, reject) => {
        this.codepipeline.startPipelineExecution(
          {
            name: this.pipelineName,
          },
          function (
            err: AWS.AWSError | undefined,
            okData: AWS.CodePipeline.StartPipelineExecutionOutput
          ) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(okData);
            }
          }
        );
      }
    );
  }

  async updatePipeline(
    existingPipeline?: AWS.CodePipeline.PipelineDeclaration
  ) {
    return await new Promise<boolean>((resolve, reject) => {
      if (!existingPipeline) {
        reject(
          new Error(
            `Pipeline '${this.pipelineName}' has no stages or does not exist`
          )
        );
      }

      if (!this.gitBranch) {
        resolve(true);
        return;
      }

      const pipeline = existingPipeline!;
      const sourceAction = pipeline.stages[0]!.actions[0]!;
      sourceAction.configuration!.Branch = this.gitBranch;

      this.codepipeline.updatePipeline(
        {
          pipeline: {
            ...pipeline,
            stages: [...pipeline.stages],
          },
        },
        function (
          err: AWS.AWSError | undefined,
          okData: AWS.CodePipeline.UpdatePipelineOutput
        ) {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log("Pipeline's been updated with the new source");
            resolve(!!okData);
          }
        }
      );
    });
  }

  async getPipeline() {
    return await new Promise<AWS.CodePipeline.PipelineDeclaration>(
      (resolve, reject) => {
        this.codepipeline.getPipeline(
          {
            name: this.pipelineName,
          },
          function (
            err: AWS.AWSError | undefined,
            okData: AWS.CodePipeline.GetPipelineOutput
          ) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(okData.pipeline!);
            }
          }
        );
      }
    );
  }

  async getPipelineExecution(executionId: string) {
    return await new Promise<AWS.CodePipeline.PipelineExecution>(
      (resolve, reject) => {
        this.codepipeline.getPipelineExecution(
          {
            pipelineName: this.pipelineName,
            pipelineExecutionId: executionId,
          },
          function (
            err: AWS.AWSError | undefined,
            okData: AWS.CodePipeline.GetPipelineExecutionOutput
          ) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(okData.pipelineExecution!);
            }
          }
        );
      }
    );
  }

  async waitForPipelineExecution(executionId: string): Promise<boolean> {
    console.log(`Checking pipeline '${this.pipelineName}' status...`);
    console.log(`Execution ID: ${executionId}`);
    if (this.timesChecked < 1) {
      console.log(
        `Waiting for ${this.delay} seconds because it's the first check.`,
        'This is to avoid false negatives and to make sure the pipeline received the execution request and is in the queue.'
      );
      await this.sleep(this.delay);
    } else {
      console.log(`Waiting for ${this.delay} seconds...`);
      await this.sleep(this.delay);
    }

    const execution = await this.getPipelineExecution(executionId);

    this.timesChecked++;

    // get type Status from execution and remove the "string" type
    const status = execution.status as PipelineExecutionStatus;

    const delay = this.delay;

    switch (status) {
      case PipelineExecutionStatus.InProgress:
        console.log(
          `Pipeline '${this.pipelineName}' in progress waiting for ${delay} more seconds.`
        );
        return await this.waitForPipelineExecution(executionId);

      case PipelineExecutionStatus.Succeeded:
        console.log(`Pipeline '${this.pipelineName}' succeeded.`);
        return true;
      case PipelineExecutionStatus.Failed:
        console.error(`Pipeline '${this.pipelineName}' failed.`);
        return false;
      case PipelineExecutionStatus.Stopping:
      case PipelineExecutionStatus.Stopped:
        console.error(`Pipeline '${this.pipelineName}' stopped.`);
        return false;
      case PipelineExecutionStatus.Superseded:
        console.warn(
          `Pipeline '${this.pipelineName}' was superseded. Skipping rest of the execution.`
        );
        return true;
      default:
        console.log(`Unknown pipeline execution status: ${status}`);
        return true;
    }
  }

  constructor() {
    console.log('Starting pipeline update...');
    const awsRegion = process.env.AWS_REGION!;
    const awsAccessKey = process.env.AWS_ACCESS_KEY_ID!;
    const awssecretKey = process.env.AWS_SECRET_ACCESS_KEY!;
    const pipelineName = process.env.PIPELINE_NAME!;
    const gitBranch = process.env.GIT_BRANCH;

    this.pipelineName = pipelineName;
    this.gitBranch = gitBranch;

    AWS.config.update({
      region: awsRegion,
      credentials: new AWS.Credentials({
        accessKeyId: awsAccessKey,
        secretAccessKey: awssecretKey,
      }),
    });

    this.codepipeline = new AWS.CodePipeline({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awssecretKey,
      },
    });
  }

  async run() {
    try {
      const existingPipeline = await this.getPipeline();
      const success = await this.updatePipeline(existingPipeline);
      console.log('Pipeline update success:', success);

      if (success) {
        const startOutput = await this.triggerPipeline();
        console.log('Pipeline execution started:', startOutput);

        const executionId = startOutput.pipelineExecutionId!;

        const execution = await this.waitForPipelineExecution(executionId);
        console.log('Pipeline execution:', execution);

        if (!execution) {
          process.exitCode = 1;
          console.error('Pipeline execution failed.');
        } else {
          console.log('Pipeline execution completed:', execution);
        }
      } else {
        console.error('Pipeline update failed.');
        process.exitCode = 1;
      }
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
    }
  }
}

async function main() {
  const pipeline = new TriggerPipeline();
  await pipeline.run();
}

Promise.resolve(main()).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import {
  CodePipelineClient,
  GetPipelineExecutionCommand,
  ListPipelineExecutionsCommand,
  PipelineExecutionStatus,
  StartPipelineExecutionCommand,
} from '@aws-sdk/client-codepipeline';
import * as codebuild from './codebuild';
import { sleep } from './util';

const CLIENT = new CodePipelineClient({});

const getNewestExecutionId = async (pipelineName: string): Promise<string> => {
  const command = new ListPipelineExecutionsCommand({
    pipelineName,
    maxResults: 1,
  });
  const data = await CLIENT.send(command);
  if (
    data.pipelineExecutionSummaries &&
    data.pipelineExecutionSummaries.length > 0
  ) {
    const executionId = data.pipelineExecutionSummaries[0]!.pipelineExecutionId;
    if (executionId) {
      return executionId;
    }
    throw new Error(`Newest pipeline execution of '${pipelineName}' has no ID`);
  }
  throw new Error('No Pipeline executions found');
};

const waitForPipeline = async (
  pipelineName: string,
  pipelineExecutionId: string,
  codebuilds?: string[]
): Promise<boolean> => {
  await sleep(10);
  const command = new GetPipelineExecutionCommand({
    pipelineName,
    pipelineExecutionId,
  });
  try {
    const data = await CLIENT.send(command);

    if (
      data.pipelineExecution === undefined ||
      !data.pipelineExecution.status
    ) {
      process.exitCode = 1;
      return false;
    }
    const { status } = data.pipelineExecution;
    switch (status) {
      case PipelineExecutionStatus.InProgress: {
        if (codebuilds) {
          const projectToBuildBatchId =
            await codebuild.getInProgressProjectToBatchIds(codebuilds);
          if (projectToBuildBatchId.length > 0) {
            await codebuild.forwardLogEventsFromCodebuild(
              projectToBuildBatchId[0]!
            );
          }
        }
        console.log(
          `Pipeline '${pipelineName}' in progress waiting for 10 more seconds.`
        );
        return await waitForPipeline(
          pipelineName,
          pipelineExecutionId,
          codebuilds
        );
      }
      case PipelineExecutionStatus.Cancelled: {
        console.log(
          `Pipeline '${pipelineName}' was canceled. Trying to get new execution ID.`
        );
        const newExecutionId = await getNewestExecutionId(pipelineName);
        console.log(
          `Waiting on pipeline '${pipelineName}' with new execution id '${newExecutionId}'`
        );
        return await waitForPipeline(pipelineName, newExecutionId, codebuilds);
      }
      case PipelineExecutionStatus.Succeeded:
        console.log(`Pipeline '${pipelineName}' succeeded.`);
        return true;
      case PipelineExecutionStatus.Failed:
        console.error(`Pipeline '${pipelineName}' failed.`);
        return false;
      case PipelineExecutionStatus.Stopping || PipelineExecutionStatus.Stopped:
        console.error(`Pipeline '${pipelineName}' stopped.`);
        return false;
      case PipelineExecutionStatus.Superseded:
        console.warn(
          `Pipeline '${pipelineName}' was superseded. Skipping rest of the execution.`
        );
        return true;
      default:
        console.error(`Unexpected status: ${status} given.`);
        return false;
    }
  } catch (error) {
    console.error(
      `An error occured while getting the status of pipeline '${pipelineName}' exucution: '${pipelineExecutionId}'.`
    );
    throw error;
  }
};

const run = async (): Promise<void> => {
  let codebuilds;
  const pipelineName: string = process.env.PIPELINE_NAME!;
  const wait: boolean = process.env.WAIT === 'true';

  const command = new StartPipelineExecutionCommand({ name: pipelineName });

  try {
    const data = await CLIENT.send(command);
    if (!data.pipelineExecutionId) {
      throw new Error('No Execution ID');
    }
    if (wait) {
      const executionResult = await waitForPipeline(
        pipelineName,
        data.pipelineExecutionId,
        codebuilds
      );
      if (!executionResult) {
        throw new Error('Execution was unsucessful.');
      }
    }
  } catch (error) {
    console.error(
      `An error occured while starting Codepipeline '${pipelineName}'`
    );
    throw error;
  }
};

run().catch((err) => {
  throw err;
});

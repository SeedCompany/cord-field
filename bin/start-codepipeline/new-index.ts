import {
  CodePipelineClient,
  GetPipelineCommand,
  GetPipelineExecutionCommand,
  ListPipelineExecutionsCommand,
  PipelineExecutionStatus,
  StartPipelineExecutionCommand,
  UpdatePipelineCommand,
} from '@aws-sdk/client-codepipeline';
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

const updatePipeline = async (
  pipelineName: string,
  gitBranch: string,
  existingPipeline: any
): Promise<void> => {
  const sourceAction = existingPipeline.stages[0]!.actions[0];
  sourceAction.configuration!.Branch = gitBranch;

  const command = new UpdatePipelineCommand({
    pipeline: {
      ...existingPipeline,
      stages: [...existingPipeline.stages],
    },
  });
  try {
    await CLIENT.send(command);
    console.log("Pipeline's been updated with the new source");

    console.log('Starting pipeline execution...');
  } catch (error) {
    console.error(
      `An error occured while updating pipeline '${pipelineName}' with new source.`
    );
    throw error;
  }
};

const waitForPipeline = async (
  pipelineName: string,
  pipelineExecutionId: string
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
        console.log(
          `Pipeline '${pipelineName}' in progress waiting for 10 more seconds.`
        );
        return await waitForPipeline(pipelineName, pipelineExecutionId);
      }
      case PipelineExecutionStatus.Cancelled: {
        console.log(
          `Pipeline '${pipelineName}' was canceled. Trying to get new execution ID.`
        );
        const newExecutionId = await getNewestExecutionId(pipelineName);
        console.log(
          `Waiting on pipeline '${pipelineName}' with new execution id '${newExecutionId}'`
        );
        return await waitForPipeline(pipelineName, newExecutionId);
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
  const pipelineName = process.env.PIPELINE_NAME!;
  const gitBranch = process.env.GIT_BRANCH;
  const command = new StartPipelineExecutionCommand({ name: pipelineName });

  if (gitBranch) {
    const getPipelineCommand = new GetPipelineCommand({ name: pipelineName });
    const pipeline = await CLIENT.send(getPipelineCommand);
    await updatePipeline(pipelineName, gitBranch, pipeline);
  }

  try {
    const data = await CLIENT.send(command);
    if (!data.pipelineExecutionId) {
      throw new Error('No Execution ID');
    }

    const executionResult = await waitForPipeline(
      pipelineName,
      data.pipelineExecutionId
    );
    if (!executionResult) {
      throw new Error('Execution was unsucessful.');
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

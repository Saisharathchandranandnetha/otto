import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class OttoAgentRun implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Otto Agent Run',
    name: 'ottoAgentRun',
    icon: 'fa:robot',
    group: ['transform'],
    version: 1,
    description: 'Triggers an Agent Run in the OTTO core',
    defaults: {
      name: 'Otto Agent Run',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Agent ID',
        name: 'agentId',
        type: 'string',
        default: '',
        required: true,
        description: 'The UUID of the Agent to run',
      },
      {
        displayName: 'Task',
        name: 'task',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        required: true,
        description: 'The task description for the agent',
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    
    for (let i = 0; i < items.length; i++) {
      try {
        const agentId = this.getNodeParameter('agentId', i) as string;
        const task = this.getNodeParameter('task', i) as string;
        
        // This is a stub for the community node execution.
        // In production, this would make an HTTP request to the OTTO API to queue a run.
        // E.g. fetch('http://localhost:3000/api/v1/agent/run', ...)
        
        const response = {
          success: true,
          agentId,
          task_received: task,
          status: 'queued'
        };

        returnData.push({ json: response });
      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
      }
    }

    return [returnData];
  }
}

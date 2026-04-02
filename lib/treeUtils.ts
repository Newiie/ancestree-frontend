import { TreeNode } from '@/types/tree';

export function findNodeRecursively(nodes: TreeNode[], nodeId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.personNodeId === nodeId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeRecursively(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}

import { TreeNode } from '@/types/tree';

export function findNodeRecursively(nodes: TreeNode[], personNodeId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.personNodeId === personNodeId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeRecursively(node.children, personNodeId);
      if (found) return found;
    }
  }
  return null;
}

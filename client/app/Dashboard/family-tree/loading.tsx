import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const FamilyTreeSkeleton = () => {
  return (
    <div className="tree-container">
        <div className="tree">
            <ul className="tree-content">
                <li>
                    <a href="#">
                        <Skeleton className="w-full h-20" />
                    </a>
                    <ul>
                        <li>
                            <a href="#">
                                <Skeleton className="w-full h-20" />
                            </a>
                            <ul>
                                <li>
                                    <a href="#">
                                        <Skeleton className="w-full h-20" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Skeleton className="w-full h-20" />

                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">
                                <Skeleton className="w-full h-20" />
                            </a>
                            <ul>
                                <li>
                                    <a href="#">
                                        <Skeleton className="w-full h-20" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Skeleton className="w-full h-20" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Skeleton className="w-full h-20" />
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
  );
};

export default FamilyTreeSkeleton;
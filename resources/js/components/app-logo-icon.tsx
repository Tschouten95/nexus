import type { SVGAttributes } from 'react';
import NexusIcon from '@/assets/nexus-icon.svg?react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <NexusIcon {...props} />;
}
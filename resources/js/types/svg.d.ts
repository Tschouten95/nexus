declare module '*.svg?react' {
    import type { SVGAttributes, FunctionComponent } from 'react';
    const ReactComponent: FunctionComponent<SVGAttributes<SVGElement>>;
    export default ReactComponent;
}
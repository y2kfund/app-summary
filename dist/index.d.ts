import { default as Summary } from './views/Summary.vue';
export { Summary };
export default Summary;
export interface SummaryProps {
    showHeaderLink?: boolean;
    userId?: string | null;
}

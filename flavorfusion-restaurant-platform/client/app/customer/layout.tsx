import CustomerDashboardLayout from '../../layouts/CustomerDashboardLayout';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>;
}

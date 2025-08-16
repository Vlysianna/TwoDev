import type { ReactNode } from "react";

interface TableProps {
	children: ReactNode;
	className?: string;
}

const TableComponent = ({ children, className = "" }: TableProps) => {
	return (
		<div
			className={`w-full bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
		>
			<div className="overflow-x-auto">
				<table className="w-full">{children}</table>
			</div>
		</div>
	);
};

interface TheadProps {
	children: ReactNode;
	className?: string;
}

const Thead: React.FC<TheadProps> = ({ children, className = "" }) => {
	return (
		<thead className={`bg-orange-500 text-white ${className}`}>
			{children}
		</thead>
	);
};

interface TbodyProps {
	children: ReactNode;
	className?: string;
}

const Tbody: React.FC<TbodyProps> = ({ children, className = "" }) => {
	return (
		<tbody className={`divide-y divide-gray-200 ${className}`}>
			{children}
		</tbody>
	);
};

interface TrProps {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

const Tr: React.FC<TrProps> = ({ children, className = "", onClick }) => {
	return (
		<tr
			className={`odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-colors ${
				onClick ? "cursor-pointer" : ""
			} ${className}`}
			onClick={onClick}
		>
			{children}
		</tr>
	);
};

interface ThProps {
	children: ReactNode;
	className?: string;
}

const Th: React.FC<ThProps> = ({ children, className = "" }) => {
	return (
		<th className={`px-6 py-4 text-left font-medium ${className}`}>
			{children}
		</th>
	);
};

interface TdProps {
	children: ReactNode;
	className?: string;
}

const Td: React.FC<TdProps> = ({ children, className = "" }) => {
	return <td className={`px-6 py-4 ${className}`}>{children}</td>;
};

const Table = Object.assign(TableComponent, {
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
});

export { Table, TableComponent, Thead, Tbody, Tr, Th, Td };

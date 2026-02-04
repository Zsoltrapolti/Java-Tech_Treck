import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

type TextAlign = 'left' | 'right' | 'center' | 'justify';

interface BaseChildrenProps {
    children: React.ReactNode;
}

interface BoldProp {
    bold?: boolean;
}

interface CellProps extends BaseChildrenProps {
    width: string;
    align?: TextAlign;
}

interface TotalRowProps {
    label: string;
    value: string;
    isGrand?: boolean;
}

const COLORS = {
    primary: '#2C6E49',
    secondary: '#E0ECD6',
    textDark: '#072d18',
    textGray: '#555555',
    border: '#e0e0e0',
    white: '#FFFFFF'
};

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: COLORS.textDark,
        backgroundColor: COLORS.white,
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        paddingBottom: 10,
    },
    brandTitle: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.primary,
        textTransform: 'uppercase',
    },
    docTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.textGray,
        textAlign: 'right',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    infoColumn: {
        width: '45%',
    },
    infoLabel: {
        fontSize: 8,
        color: COLORS.primary,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    infoText: {
        fontSize: 10,
        marginBottom: 2,
    },
    infoTextBold: {
        fontSize: 10,
        marginBottom: 2,
        fontFamily: 'Helvetica-Bold',
    },
    tableContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        height: 28,
        borderRadius: 3,
    },
    tableHeaderCell: {
        color: COLORS.secondary,
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        paddingHorizontal: 6,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        height: 24,
        alignItems: 'center',
    },
    tableCell: {
        color: COLORS.textDark,
        fontSize: 9,
        paddingHorizontal: 6,
    },
    totalsWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    totalsBox: {
        width: '40%',
        padding: 8,
        backgroundColor: '#fcfcfc',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    grandTotalRow: {
        borderTopWidth: 1,
        borderTopColor: COLORS.primary,
        paddingTop: 4,
    },
    totalLabel: {
        fontSize: 10,
        color: COLORS.textGray,
    },
    grandTotalText: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: COLORS.primary,
    }
});

export const InvoiceDocument = ({ children }: BaseChildrenProps) => (
    <Document>{children}</Document>
);

export const InvoicePage = ({ children }: BaseChildrenProps) => (
    <Page size="A4" style={styles.page}>{children}</Page>
);

export const HeaderContainer = ({ children }: BaseChildrenProps) => (
    <View style={styles.headerWrapper}>{children}</View>
);

export const BrandName = ({ children }: BaseChildrenProps) => (
    <Text style={styles.brandTitle}>{children}</Text>
);

export const DocumentTitle = ({ children }: BaseChildrenProps) => (
    <Text style={styles.docTitle}>{children}</Text>
);

export const InfoSection = ({ children }: BaseChildrenProps) => (
    <View style={styles.infoRow}>{children}</View>
);

export const InfoColumn = ({ children }: BaseChildrenProps) => (
    <View style={styles.infoColumn}>{children}</View>
);

export const Label = ({ children }: BaseChildrenProps) => (
    <Text style={styles.infoLabel}>{children}</Text>
);

export const InfoValue = ({ children, bold }: BaseChildrenProps & BoldProp) => (
    <Text style={bold ? styles.infoTextBold : styles.infoText}>{children}</Text>
);

export const TableContainer = ({ children }: BaseChildrenProps) => (
    <View style={styles.tableContainer}>{children}</View>
);

export const TableHeader = ({ children }: BaseChildrenProps) => (
    <View style={styles.tableHeaderRow}>{children}</View>
);

export const TableRow = ({ children }: BaseChildrenProps) => (
    <View style={styles.tableRow}>{children}</View>
);

export const HeaderCell = ({ width, align, children }: CellProps) => (
    <Text style={[styles.tableHeaderCell, { width, textAlign: align || 'left' }]}>{children}</Text>
);

export const BodyCell = ({ width, align, children }: CellProps) => (
    <Text style={[styles.tableCell, { width, textAlign: align || 'left' }]}>{children}</Text>
);

export const TotalsSection = ({ children }: BaseChildrenProps) => (
    <View style={styles.totalsWrapper}>
        <View style={styles.totalsBox}>{children}</View>
    </View>
);

export const TotalRow = ({ label, value, isGrand }: TotalRowProps) => (
    <View style={[
        styles.totalRow,
        isGrand ? styles.grandTotalRow : {}
    ]}>
        <Text style={isGrand ? styles.grandTotalText : styles.totalLabel}>{label}</Text>
        <Text style={isGrand ? styles.grandTotalText : styles.infoText}>{value}</Text>
    </View>
);
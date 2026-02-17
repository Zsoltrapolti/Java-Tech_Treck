import type { InvoiceDTO } from '../../types/Invoice';
import { View } from '@react-pdf/renderer';

import {
    InvoiceDocument as Doc,
    InvoicePage,
    HeaderContainer,
    BrandName,
    DocumentTitle,
    InfoSection,
    InfoColumn,
    Label,
    InfoValue,
    TableContainer,
    TableHeader,
    TableRow,
    HeaderCell,
    BodyCell,
    TotalsSection,
    TotalRow
} from "../../ui/InvoiceDocument.styles.tsx";

const WIDTHS = {
    prod: '45%',
    um: '15%',
    qty: '10%',
    price: '15%',
    val: '15%'
};

export const InvoiceDocument = ({ invoice }: { invoice: InvoiceDTO }) => {

    const addrParts = invoice.clientAddress ? invoice.clientAddress.split(',') : [];
    return (
        <Doc>
            <InvoicePage>

                <HeaderContainer>
                    <View>
                        <BrandName>KRUMPI</BrandName>
                        <InfoValue bold>MANAGEMENT SRL</InfoValue>
                    </View>
                    <View>
                        <DocumentTitle>TAX INVOICE</DocumentTitle>
                        <InfoValue>Series: {invoice.series} No: {invoice.number}</InfoValue>
                        <InfoValue>Date: {invoice.date}</InfoValue>
                    </View>
                </HeaderContainer>

                <InfoSection>
                    <InfoColumn>
                        <Label>SUPPLIER</Label>
                        <InfoValue bold>{invoice.supplierName}</InfoValue>
                        <InfoValue>{invoice.supplierAddress}</InfoValue>
                        <InfoValue>TAX ID: {invoice.supplierCui}</InfoValue>
                        <InfoValue>Bank: {invoice.supplierBank}</InfoValue>
                        <InfoValue>{invoice.supplierIban}</InfoValue>
                    </InfoColumn>

                    <InfoColumn>
                        <Label>CLIENT</Label>
                        <InfoValue bold>{invoice.clientName}</InfoValue>
                        {addrParts.length >= 3 ? (
                            <>
                                <InfoValue>{addrParts[0]}</InfoValue>
                                <InfoValue>
                                    {addrParts[1]}, {addrParts[2]}
                                </InfoValue>
                                {addrParts[3] && <InfoValue>ZIP: {addrParts[3]}</InfoValue>}
                            </>
                        ) : (
                            <InfoValue>{invoice.clientAddress}</InfoValue>
                        )}
                    </InfoColumn>
                </InfoSection>

                <TableContainer>
                    <TableHeader>
                        <HeaderCell width={WIDTHS.prod}>Product</HeaderCell>
                        <HeaderCell width={WIDTHS.um} align="center">Unit</HeaderCell>
                        <HeaderCell width={WIDTHS.qty} align="center">Qty</HeaderCell>
                        <HeaderCell width={WIDTHS.price} align="right">Unit Price</HeaderCell>
                        <HeaderCell width={WIDTHS.val} align="right">Amount</HeaderCell>
                    </TableHeader>

                    {invoice.items.map((item, index) => (
                        <TableRow key={index}>
                            <BodyCell width={WIDTHS.prod}>{item.productName}</BodyCell>
                            <BodyCell width={WIDTHS.um} align="center">{item.unitOfMeasure}</BodyCell>
                            <BodyCell width={WIDTHS.qty} align="center">{item.quantity.toString()}</BodyCell>
                            <BodyCell width={WIDTHS.price} align="right">{item.pricePerUnit.toFixed(2)}</BodyCell>
                            <BodyCell width={WIDTHS.val} align="right">{item.totalValue.toFixed(2)}</BodyCell>
                        </TableRow>
                    ))}
                </TableContainer>

                <TotalsSection>
                    <TotalRow label="Net Total:" value={`${invoice.totalNet.toFixed(2)} RON`}/>
                    <TotalRow label="VAT (19%):" value={`${invoice.totalVat.toFixed(2)} RON`}/>
                    <TotalRow
                        isGrand
                        label="GRAND TOTAL:"
                        value={`${invoice.totalGross.toFixed(2)} RON`}
                    />
                </TotalsSection>

            </InvoicePage>
        </Doc>
    );
};
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

export const InvoiceDocument = ({ invoice }: { invoice: InvoiceDTO }) => (
    <Doc>
        <InvoicePage>

            <HeaderContainer>
                <View>
                    <BrandName>KRUMPI</BrandName>
                    <InfoValue bold>MANAGEMENT SRL</InfoValue>
                </View>
                <View>
                    <DocumentTitle>FACTURĂ FISCALĂ</DocumentTitle>
                    <InfoValue>Serie: {invoice.series} Nr: {invoice.number}</InfoValue>
                    <InfoValue>Data: {invoice.date}</InfoValue>
                </View>
            </HeaderContainer>

            <InfoSection>
                <InfoColumn>
                    <Label>FURNIZOR</Label>
                    <InfoValue bold>{invoice.supplierName}</InfoValue>
                    <InfoValue>{invoice.supplierAddress}</InfoValue>
                    <InfoValue>CUI: {invoice.supplierCui}</InfoValue>
                    <InfoValue>Banca: {invoice.supplierBank}</InfoValue>
                    <InfoValue>{invoice.supplierIban}</InfoValue>
                </InfoColumn>

                <InfoColumn>
                    <Label>CLIENT</Label>
                    <InfoValue bold>{invoice.clientName}</InfoValue>
                    <InfoValue>{invoice.clientAddress}</InfoValue>
                </InfoColumn>
            </InfoSection>

            <TableContainer>
                <TableHeader>
                    <HeaderCell width={WIDTHS.prod}>Produs</HeaderCell>
                    <HeaderCell width={WIDTHS.um} align="center">U.M.</HeaderCell>
                    <HeaderCell width={WIDTHS.qty} align="center">Cant.</HeaderCell>
                    <HeaderCell width={WIDTHS.price} align="right">Preț Unit</HeaderCell>
                    <HeaderCell width={WIDTHS.val} align="right">Valoare</HeaderCell>
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
                <TotalRow label="Total Net:" value={`${invoice.totalNet.toFixed(2)} RON`} />
                <TotalRow label="TVA (19%):" value={`${invoice.totalVat.toFixed(2)} RON`} />
                <TotalRow
                    isGrand
                    label="TOTAL PLATĂ:"
                    value={`${invoice.totalGross.toFixed(2)} RON`}
                />
            </TotalsSection>

        </InvoicePage>
    </Doc>
);
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface Props {
  formData: any;
}

const ReportDocument: React.FC<Props> = ({ formData }) => {
  return (
    <Document>
      <Page size="A4">
        <View>
          <Text>Bill Invoice</Text>
        </View>
        <View>
          {/* Your PDF content here */}
          <Text>Due Date: {formData.dueDate}</Text>
          <Text>Items:</Text>
          <View>
            {formData.items.map((item: any, index: any) => (
              <View key={index}>
                <Text>{item.item}</Text>
                <Text>${item.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReportDocument;

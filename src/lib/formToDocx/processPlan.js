import * as fs from "fs";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  TextRun,
  AlignmentType,
  VerticalAlign,
  LevelFormat,
  convertInchesToTwip,
  ImageRun,
  UnderlineType,
  FrameAnchorType,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  Footer,
} from "docx";

export const genDocProcessPlan = async (processPlans) => {
  const months = processPlans.processPlan[0].months.length;
  const processPlanNumber = processPlans.processPlan.length;
  const name = processPlans.signature.name;
  const img = processPlans.signature.img;
  const date = processPlans.signature.date;
  const monthStart = processPlans.date.month;
  const yearStart = processPlans.date.year;
  const font = "TH SarabunPSK";
  const processPlan = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "แผนการดำเนินการจัดทำวิทยานิพนธ์\t",
        bold: true,
        font: font,
        size: 36,
      }),
      new TextRun({
        text: `(เริ่มทำวิทยานิพนธ์ เดือน ${monthStart} ปี พ.ศ. ${yearStart})`,
        bold: true,
        font: font,
        size: 36.0,
        break: 1,
      }),
      new TextRun({
        bold: true,
        font: font,
        size: 36.0,
        break: 1,
      }),
    ],
  });
  const tableProcessPlan = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            width: {
              size: `${412.6}pt`,
              type: WidthType.DXA,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "กิจกรรม /ขั้นตอนการดำเนินการ",
                    bold: true,
                    font: font,
                    size: 32.0,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            width: {
              size: `${331.7}pt`,
              type: WidthType.DXA,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "เดือน",
                    bold: true,
                    font: font,
                    size: 32.0,
                  }),
                ],
              }),
              new Table({
                borders: false,
                margins: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
                rows: [
                  new TableRow({
                    children: Array.from(
                      { length: months },
                      (_, i) =>
                        new TableCell({
                          verticalAlign: VerticalAlign.CENTER,
                          borders: {
                            top: { style: "single", size: 1 },
                            left: { style: "single", size: 1 },
                          },
                          width: {
                            size: `${331.7 / months}pt`,
                            type: WidthType.DXA,
                          },
                          margins: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                          },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: (i + 1).toString(),
                                  bold: true,
                                  font: font,
                                  size: 32.0,
                                }),
                              ],
                            }),
                          ],
                        })
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      ...processPlans.processPlan.map((processPlans_, index) => {
        const isInLastThree = Array.from({ length: processPlanNumber }, (_, i) => i + 1)
          .slice(-5)
          .includes(index);
        const paragraphOptions = {
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: ` ${processPlans_.step}`,
              font: font,
              size: 32.0,
            }),
          ],
        };

        if (!isInLastThree) {
          paragraphOptions.numbering = {
            reference: "numbering",
            level: 0,
          };
        }

        return new TableRow({
          children: [
            new TableCell({
              margins: { left: 5.75, right: 5.75, top: 0, bottom: 0 },
              verticalAlign: VerticalAlign.CENTER,
              width: {
                size: `${412.6}pt`,
                type: WidthType.DXA,
              },
              children: [new Paragraph(paragraphOptions)],
            }),
            new TableCell({
              verticalAlign: VerticalAlign.CENTER,
              width: {
                size: `${331.7}pt`,
                type: WidthType.DXA,
              },
              children: [
                new Table({
                  borders: false,
                  width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                  },
                  rows: [
                    new TableRow({
                      children: Array.from(
                        { length: months },
                        (_, i) =>
                          new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            borders: {
                              right: { style: "single", size: 1 },
                            },
                            width: {
                              size: 100 / months,
                              type: WidthType.PERCENTAGE,
                            },
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text:
                                      processPlans_.months[i] === 1
                                        ? "X"
                                        : processPlans_.months[i] === 0 ||
                                          !processPlans_.months[i]
                                        ? ""
                                        : `${processPlans_.months[i]}`,
                                    font: font,
                                    size: 32.0,
                                  }),
                                ],
                              }),
                            ],
                          })
                      ),
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      }),
    ],
  });
  const signature = new Paragraph({
    alignment: AlignmentType.CENTER,
    frame: {
      position: {
        x: 9000,
        y: 0,
      },
      width: 4000,
      height: 200,
      anchor: {
        horizontal: FrameAnchorType.TEXT,
        vertical: FrameAnchorType.TEXT,
      },
      alignment: {
        x: HorizontalPositionAlign.CENTER,
        y: VerticalPositionAlign.CENTER,
      },
      wrap: "notBeside",
    },
    children: [
      new TextRun({ break: 1 }),
      new Paragraph({
        children: [
          new TextRun({
            text: "ลงชื่อ",
            font: font,
            size: 32.0,
          }),
          new TextRun({
            underline: { type: UnderlineType.DOTTED },
            children: [
              new ImageRun({
                type: "png",
                data: img,
                transformation: {
                  width: 500 / 3.25,
                  height: 200 / 3.25,
                },
              }),
            ],
          }),
          new TextRun({ break: 1 }),
          new TextRun({
            underline: { type: UnderlineType.DOTTED },
            text: `(${name})`,
            font: font,
            size: 32.0,
          }),
          new TextRun({ break: 1 }),
          new TextRun({
            text: `วันที่ `,
            font: font,
            size: 32.0,
          }),
          new TextRun({
            underline: { type: UnderlineType.DOTTED },
            text: `${date}`,
            font: font,
            size: 32.0,
          }),
        ],
      }),
    ],
  });
  const footer = {
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "FM-ENG-GRD-05-00", font: font, size: 24 })],
          }),
        ],
      }),
    },
  };

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "numbering",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.4),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
                run: {
                  size: 32,
                  font: font,
                  bold: false,
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        ...footer,
        properties: {
          page: {
            margin: {
              top: `${49.6}pt`,
              bottom: `${10}pt`,
            },
            size: {
              orientation: "landscape",
            },
          },
        },
        children: [processPlan, tableProcessPlan, signature],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
};

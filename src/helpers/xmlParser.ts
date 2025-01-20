import { XMLBuilder, XMLParser } from "fast-xml-parser";
import _ from "lodash";

const { matches, filter } = _;

class XMLDocument {
  xml_object: any;
  parser_options = {
    ignoreAttributes: false,
    ignoreDeclaration: false,
    parseTagValue: false,
  };

  constructor(xml_str: string) {
    const parser = new XMLParser(this.parser_options);
    this.xml_object = parser.parse(xml_str) || {};
  }

  /**
   * Deletes elements based on a path query and optional condition.
   * @param path_query Path to the element.
   * @param condition Optional condition to filter elements for deletion.
   */
  delete(path_query: string, condition?: any): void {
    const segments = path_query.split("/");
    const lastSegment = segments.pop()!;
    let current = this.xml_object;

    for (const segment of segments) {
      current = current?.[segment];
      if (!current) return;
    }

    if (Array.isArray(current[lastSegment])) {
      current[lastSegment] = filter(current[lastSegment], (item) => !matches(condition)(item));
    } else {
      delete current[lastSegment];
    }
  }

  /**
   * Converts the XML object back into a string.
   * @returns Canonical XML string.
   */
  toString(): string {
    const builder = new XMLBuilder({ ...this.parser_options, format: true });
    return builder.build(this.xml_object);
  }
}

export default XMLDocument;

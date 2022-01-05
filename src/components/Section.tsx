import { Layout } from "@shopify/polaris"

interface ISection {
  sectionTitle: string,
  sectionDescription: string,
  children?: React.ReactNode,
}

const Section: React.FC<ISection> = ({
  sectionTitle,
  sectionDescription,
  children
}) => {

  return (
    <Layout>
      <Layout.AnnotatedSection
        title={sectionTitle}
        description={sectionDescription} >
          {children}
      </Layout.AnnotatedSection>
    </Layout>
  )
}

export default Section

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
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <div className="lg:mt-8">
        <h2 className="font-semibold text-3xl">
          {sectionTitle}
        </h2>
        <p className="text-gray-500 mt-2 lg:mt-6">
          {sectionDescription}
        </p>
      </div>
      <div className="col-span-2">
        {children}
      </div>
    </section>
  )
}

export default Section

module Api
  module V1
    module Indc
      class CountriesDocumentsSerializer < ActiveModel::Serializer
        attributes :documents, :laws, :policies, :data

        def data
          object.data.map do |datum|
            [datum.iso_code3,
             ::Indc::Document.joins(values: :location).
             where(locations: {iso_code3: datum.iso_code3}).
             order(:ordering).distinct.to_a
             ]
          end.to_h
        end

        def documents
          ::Indc::Document.order(:ordering).map do |d|
            {
              id: d.id,
              ordering: d.ordering,
              slug: d.slug,
              long_name: d.long_name,
              description: d.description,
              is_ndc: d.is_ndc,
              total_countries: d.locations.distinct.count
            }
          end
        end

        def laws
          {}
        end

        def policies
          {}
        end
      end
    end
  end
end

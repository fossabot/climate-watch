module Api
  module V1
    module Data
      module HistoricalEmissions
        class GwpSerializer < ActiveModel::Serializer
          attributes :id, :name
        end
      end
    end
  end
end

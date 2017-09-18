module Api
  module V1
    module Adaptation
      class VariableSerializer < ActiveModel::Serializer
        attribute :slug
        attribute :name
        has_many :values, serializer: Adaptation::ValueSerializer do
          object.values.select(&:value)
        end
      end
    end
  end
end

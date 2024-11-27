import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd'; // Import Ant Design components
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select;

const UpdateVariantForm = () => {
  const [variant, setVariant] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const brandsResponse = await axios.get('http://localhost:5500/brands');
      if (brandsResponse && brandsResponse.data) {
        setBrands(brandsResponse.data);
        setLoading(false);
      } else {
        console.error('Invalid response format');
        console.log('brandsResponse:', brandsResponse.data);

      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      message.error('Failed to fetch brands');
    }

    try {
      const variantResponse = await axios.get(`http://localhost:5500/VarientUpdate/${id}`);
      if (variantResponse && variantResponse.data) {
        const { variant, brand, model } = variantResponse.data;
        setVariant(variant);
        form.setFieldsValue({ variant, brandId: brand, modelId: model }); // Set form values here
        fetchModels(brand);
      } else {
        console.error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching variant details:', error);
      message.error('Failed to fetch variant details');
    }
  };

  const fetchModels = async (brandId) => {
    try {
      const modelsResponse = await axios.get(`http://localhost:5500/models?brandId=${brandId}`);
      if (modelsResponse && modelsResponse.data) {
        setModels(modelsResponse.data);
      } else {
        console.error('Invalid response format');
        message.error('Failed to fetch models');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      message.error('Failed to fetch models');
    }
  };


  const onFinish = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5500/variants/${id}`, {
        variant: values.variant,
        brandId: values.brandId,
        modelId: values.modelId
      });
      console.log(response.data);
      message.success('Variant updated successfully');
      navigate('/varients');
    } catch (error) {
      console.error('Error updating variant:', error);
      message.error('Failed to update variant');
    }
  };

  return (
    <div className='new-car-form-container'>
      {!loading && (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Variant"
            name="variant"
            rules={[{ required: true, message: 'Please enter the variant' }]}
          >
            <Input className="input-field" value={variant} onChange={e => setVariant(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brandId"
            rules={[{ required: true, message: 'Please select a brand' }]}
          >
            <Select onChange={(value) => fetchModels(value)}>
              {brands.map((brand) => (
                <Option key={brand._id} value={brand._id}>
                  {brand.brand}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Model"
            name="modelId"
            rules={[{ required: true, message: 'Please select a model' }]}
          >
            <Select>
              {models.map((model) => (
                <Option key={model._id} value={model._id}>
                  {model.model}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{ width: '100%' }} htmlType="submit">
              Update Variant
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UpdateVariantForm;
